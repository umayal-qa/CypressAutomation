# Use a pre-built Cypress image with Chrome and Node.js
FROM cypress/browsers:node16.13.0-chrome94-ff93

# Set working directory
WORKDIR /app

# Copy only package files first to take advantage of Docker cache
COPY package*.json ./

# Install dependencies for the project (including Cypress)
RUN npm install

# Install any additional dependencies that may be required for Cypress to run headlessly
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libnss3 \
    fonts-liberation \
    libappindicator3-1 \
    libu2f-udev \
    libgdk-pixbuf2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of the project files into the container
COPY . .

# Install Cypress (if it's not already in package.json or node_modules)
RUN npx cypress install

# Set the default entrypoint for the container to run Cypress tests
ENTRYPOINT ["npx", "cypress", "run"]

# Optionally, you could specify a command to run when the container is started interactively (e.g., npm start)
# ENTRYPOINT ["npm", "start"]
