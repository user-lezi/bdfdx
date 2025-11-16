import { createAPIRoute } from "../../apiRoute";
import os from "os";

export default createAPIRoute({
  path: "/bot",
  methods: ["get"],

  description: "Returns all the information about the bot.",
  query: {},
  body: {},

  async callback(ctx) {
    const client = ctx.client;
    const user = client.user;

    ctx.res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        discriminator: user.discriminator,
        tag: user.tag,
        avatar: user.displayAvatarURL({ size: 1024 }) ?? null,
        banner: user.bannerURL({ size: 1024 }) ?? null,
        createdTimestamp: user.createdTimestamp,
      },

      application: {
        id: client.application.id,
        name: client.application.name,
        description: client.application.description ?? null,
        public: client.application.botPublic,
        termsOfServiceUrl: client.application.termsOfServiceURL ?? null,
        privacyPolicyUrl: client.application.privacyPolicyURL ?? null,
        flags: client.application.flags?.toArray() ?? [],
      },

      stats: {
        guilds: client.guilds.cache.size,
        users: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
        uptime: client.uptime,
        readyTimestamp: client.readyTimestamp,
        ping: client.ws.ping,
      },

      runtime: {
        nodeVersion: process.version,
        discordJSVersion: require("discord.js").version,
        memory: {
          rss: process.memoryUsage().rss,
          heapUsed: process.memoryUsage().heapUsed,
        },
        platform: os.platform(),
        arch: os.arch(),
      },
    });
  },
});
