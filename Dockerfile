FROM node:20-alpine as deps 

RUN apk upgrade \
  && reboot \
  && wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - \
  && export PNPM_HOME="/root/.local/share/pnpm" \
  && echo "export PATH=$PNPM_HOME:$PATH" > .shrc 
WORKDIR /web 
COPY package.json ./package.json 
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN source ~/.shrc && pnpm i 
COPY . .
RUN source ~/.shrc && pnpm build

FROM deps as runner 
WORKDIR /web
COPY --from=deps /web/public ./public
COPY --from=deps /web/.next ./.next
COPY --from=deps /web/node_modules ./node_modules
COPY --from=deps /web/package.json ./package.json

EXPOSE 3000

CMD source ~/.shrc && pnpm start