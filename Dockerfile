FROM nginx
MAINTAINER Tom<Van>Wang
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/
COPY default.conf /etc/nginx/conf.d/
COPY aijiangsb.com.crt /etc/nginx/
COPY aijiangsb.com.key /etc/nginx/
COPY aijiangsbFull.crt /etc/nginx/
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]