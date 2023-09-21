FROM node:18-alpine as Base

# npm run build

ENV NODE_ENV={NODE_ENV}

EXPOSE 3011

CMD [ "npm run start:${NODE_ENV}}" ]