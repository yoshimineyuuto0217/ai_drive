FROM node:22-alpine3.24

# openssl + musl compat: Prisma migrate still needs native engines
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
# prisma generate loads prisma.config.ts, which requires DATABASE_URL via env()
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/qiita_app
RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .

EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
