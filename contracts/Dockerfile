# Use an official Rust runtime as a parent image
FROM rust:latest AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY src ./src

# Build the application
RUN cargo build --release

# Use an Ubuntu base image
FROM ubuntu:latest

# Install necessary libraries
RUN apt-get update && apt-get install -y libc6

# Copy the built application from the build stage
COPY --from=build /usr/src/app/target/release/contracts /usr/local/bin/contracts

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["/usr/local/bin/contracts"]