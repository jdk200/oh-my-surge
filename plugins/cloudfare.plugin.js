import "isomorphic-fetch";

export default function(config) {
  return {
    async fetch() {
      try {
        const response = await fetch("https://www.cloudflare.com/ips-v4");
        if (response.status === 200) {
          return response.text();
        }
        console.error(response);
      } catch (err) {
        console.error(err);
      }
      return null;
    },
    process(result) {
      return result
        .split("\n")
        .filter(ip_prefix => ip_prefix !== "")
        .map(ip_prefix => `IP-CIDR,${ip_prefix},Proxy`)
        .join("\n");
    }
  };
}
