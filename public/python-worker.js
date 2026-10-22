let pyodidePromise;
let pyodideInstance;
let running = false;

async function getPyodide() {
  if (!pyodidePromise) {
    self.postMessage({ type: "loading-runtime" });
    pyodidePromise = (async () => {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js");
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/",
      });
      pyodideInstance.runPython("__playground_globals = {'__name__': '__main__'}");
      self.postMessage({ type: "ready" });
      return pyodideInstance;
    })().catch((error) => {
      pyodidePromise = null;
      throw error;
    });
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  if (event.data?.type !== "run" || running) return;
  running = true;
  try {
    const pyodide = await getPyodide();
    pyodide.globals.set("__playground_user_code", String(event.data.code || ""));
    self.postMessage({ type: "started" });
    await pyodide.runPythonAsync(`
import sys, io, traceback
__playground_stdout = io.StringIO()
__playground_stderr = io.StringIO()
__playground_old_stdout, __playground_old_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = __playground_stdout, __playground_stderr
try:
    exec(compile(__playground_user_code, "<playground>", "exec"), __playground_globals)
except BaseException:
    traceback.print_exc(file=__playground_stderr)
finally:
    sys.stdout, sys.stderr = __playground_old_stdout, __playground_old_stderr
__playground_output = __playground_stdout.getvalue()
__playground_error = __playground_stderr.getvalue()
`);
    const output = pyodide.globals.get("__playground_output");
    const error = pyodide.globals.get("__playground_error");
    self.postMessage({ type: "result", output: output || "", error: error || "" });
  } catch (error) {
    self.postMessage({ type: "fatal", error: error?.message || String(error) });
  } finally {
    running = false;
  }
};
