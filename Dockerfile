FROM node:8
MAINTAINER Prashanth Madi <prashanthrmadi@gmail.com>

# Install openssh for web-ssh access from kudu
RUN apt-get update && apt-get install \
      --no-install-recommends --no-install-suggests -y \
      openssh-server \
      supervisor \
      && echo "root:Docker!" | chpasswd

RUN npm install pm2 -g

WORKDIR /app

# COPY Config Files
COPY src src/
COPY package.json .
COPY pm2.json .
COPY init-container.sh /bin/
COPY sshd_config /etc/ssh/
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf	

ENV PORT 8080

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 2222 8080
CMD ["/bin/init-container.sh"]