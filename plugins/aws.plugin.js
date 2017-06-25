import "isomorphic-fetch";

export default function(config) {
  return {
    async fetch() {
      try {
        const response = await fetch(
          "https://ip-ranges.amazonaws.com/ip-ranges.json"
        );
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
      const content = JSON.parse(result);
      return content.prefixes
        .map(({ ip_prefix }) => `IP-CIDR,${ip_prefix},Proxy`)
        .join("\n");
    }
  };
}
