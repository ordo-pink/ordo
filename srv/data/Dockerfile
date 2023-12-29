FROM ubuntu:latest

MAINTAINER 谢尔盖||↓ and the Ordo.pink contributors <hello@ordo.pink>
LABEL pink.ordo.env="PROD"
LABEL pink.ordo.service="DT"
LABEL pink.ordo.region="cis"
LABEL pink.ordo.description="Docker image for Ordo DT service"

ARG ORDO_DT_PORT

EXPOSE ${ORDO_DT_PORT:-3002}

COPY ./var/out/dt /dt

CMD /dt
