FROM ubuntu:latest

ARG ORDO_ID_DOCKER_PORT
ARG ORDO_ID_DOCKER_ENV
ARG ORDO_ID_DOCKER_REGION

MAINTAINER 谢尔盖||↓ and the Ordo.pink contributors <hello@ordo.pink>
LABEL pink.ordo.service="ID"
LABEL pink.ordo.description="Docker image for Ordo ID service"
LABEL pink.ordo.env=${ORDO_ID_DOCKER_ENV}
LABEL pink.ordo.region=${ORDO_ID_DOCKER_REGION}

EXPOSE ${ORDO_ID_PORT:-3001}

COPY ./var/out/dt /dt

CMD /dt
