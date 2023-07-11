FROM node:20-alpine as deps 

ARG LINELIFF_ID 
RUN apk upgrade \
  && reboot \
  && wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - \
  && export PNPM_HOME="/root/.local/share/pnpm" \
  && echo "export PATH=$PNPM_HOME:$PATH" > .shrc 
WORKDIR /web 
COPY . .
RUN echo "LINELIFF_ID=$LINELIFF_ID" > .env
RUN source ~/.shrc \
&& pnpm i \
&& pnpm build 

FROM deps as runner 
WORKDIR /web
COPY --from=deps /web/public ./public
COPY --from=deps /web/.next ./.next
COPY --from=deps /web/node_modules ./node_modules
COPY --from=deps /web/package.json ./package.json

EXPOSE 3000

CMD source ~/.shrc && pnpm start