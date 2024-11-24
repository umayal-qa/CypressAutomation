FROM cypress/included:10.0.0

# Set working directory
WORKDIR /app

# Copy project files into the container
COPY . .

# Install dependencies
RUN npm install

