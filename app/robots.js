import { getSiteUrl } from '@/lib/posts';
export default function robots(){return {rules:{userAgent:'*',allow:'/'},sitemap:`${getSiteUrl()}/sitemap.xml`};}
