FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN apk update && apk add --no-cache git ca-certificates tzdata
ENV GOPROXY=https://proxy.golang.org,direct
RUN go mod download

COPY . .
RUN go build -o main ./cmd

FROM alpine:latest
RUN apk add --no-cache tzdata
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8080
CMD ["./main"]
