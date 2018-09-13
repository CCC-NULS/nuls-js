FROM node:8.9.3
LABEL maintainer "amalcaraz <amalcaraz89@gmail.com>"

# Update system dependencies
RUN apt-get update && \
    apt-get -y install \
    nano \
    vim \
    sudo \
    apt-transport-https

# Install yarn (Already installed in node image)
# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
# RUN sudo apt-get update && sudo apt-get -y install yarn

# Install app dependencies
WORKDIR /code

ENTRYPOINT [ "./environment/entry.sh" ]
CMD ["coverage"]
