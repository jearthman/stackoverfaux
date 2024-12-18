FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Make sure node_modules/.bin is in the PATH
ENV PATH /app/node_modules/.bin:$PATH

# Expose port 3001
EXPOSE 3001

# Start development server
CMD ["npm", "run", "dev"]
