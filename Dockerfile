# Dockerfile example to cache dependencies
FROM cypress/included:12.0.0

WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies only when necessary
RUN npm install

# Copy the application files
COPY . .

# Default command to run Cypress tests in headless mode
CMD ["npx", "cypress", "run", "--headless", "--browser", "chrome"]
