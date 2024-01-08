FROM ubuntu:latest

ARG ORDO_DT_DOCKER_PORT
ARG ORDO_DT_DOCKER_ENV
ARG ORDO_DT_DOCKER_REGION

MAINTAINER 谢尔盖||↓ and the Ordo.pink contributors <hello@ordo.pink>
LABEL pink.ordo.service="DT"
LABEL pink.ordo.description="Docker image for Ordo DT service"
LABEL pink.ordo.env=${ORDO_DT_DOCKER_ENV}
LABEL pink.ordo.region=${ORDO_DT_DOCKER_REGION}

EXPOSE ${ORDO_DT_PORT:-3002}

COPY ./var/out/dt /dt

CMD /dt
