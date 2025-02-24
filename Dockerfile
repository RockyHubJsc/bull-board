FROM node:20.11-alpine

LABEL Maintainer="Tuan Bui <tuan.bm@rockyhub.io>" \
    Description="Lightweight container for nodejs application on Alpine Linux."

WORKDIR /

COPY . .

# ENV NODE_ENV=production
# ENV API_URL=https://bull-board-dev.meetyapp.io
# ENV SHOPIFY_API_KEY=245904e8ae6f4c5fb0351d975cf49a6d

# RUN yarn build:web

CMD ["pnpm", "start:prod"]
