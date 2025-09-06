#!/bin/bash

# NEEZS PM2 Wrapper Script
# Usage: ./pm2 start, ./pm2 status, etc.

show_ports() {
    echo ""
    echo "🌐 NEEZS Services & Ports:"
    echo "┌─────────────────┬─────────┬──────────────────────────┐"
    echo "│ Service         │ Port    │ URL                      │"
    echo "├─────────────────┼─────────┼──────────────────────────┤"
    echo "│ neezs-backend   │ :8000   │ http://localhost:8000    │"
    echo "│ neezs-frontend  │ :5000   │ http://localhost:5000    │"
    echo "│ neezs-web       │ :3000   │ http://localhost:3000    │"
    echo "└─────────────────┴─────────┴──────────────────────────┘"
    echo ""
}

case "$1" in
  start)
    echo "🚀 Starting NEEZS applications with PM2..."
    pm2 start ecosystem.config.json
    show_ports
    ;;
  stop)
    echo "🛑 Stopping NEEZS applications..."
    pm2 stop all
    ;;
  restart)
    echo "🔄 Restarting NEEZS applications..."
    pm2 restart all
    show_ports
    ;;
  status)
    pm2 status
    ;;
  info)
    pm2 status
    show_ports
    ;;
  logs)
    if [ -z "$2" ]; then
      echo "📋 Showing all logs..."
      pm2 logs
    else
      echo "📋 Showing logs for $2..."
      pm2 logs "$2"
    fi
    ;;
  monitor)
    echo "📊 Opening PM2 monitor..."
    pm2 monit
    ;;
  delete)
    echo "🗑️ Deleting all PM2 processes..."
    pm2 delete all
    ;;
  reload)
    echo "♻️ Reloading all applications..."
    pm2 reload all
    show_ports
    ;;
  save)
    echo "💾 Saving PM2 process list..."
    pm2 save
    ;;
  list|ls)
    pm2 list
    show_ports
    ;;
  ports)
    show_ports
    ;;
  *)
    echo "NEEZS PM2 Commands"
    echo "Usage: ./pm2 {start|stop|restart|status|logs|monitor|delete|reload|save|list|ports}"
    echo ""
    echo "Commands:"
    echo "  start    - Start all NEEZS applications"
    echo "  stop     - Stop all applications"
    echo "  restart  - Restart all applications"
    echo "  status   - Show status of all applications + ports"
    echo "  logs     - Show logs (optionally: ./pm2 logs app-name)"
    echo "  monitor  - Open PM2 monitoring dashboard"
    echo "  delete   - Delete all PM2 processes"
    echo "  reload   - Zero-downtime reload"
    echo "  save     - Save current process list"
    echo "  list     - List all processes + ports"
    echo "  ports    - Show ports only"
    echo ""
    echo "Examples:"
    echo "  ./pm2 start"
    echo "  ./pm2 status"
    echo "  ./pm2 logs neezs-backend"
    echo "  ./pm2 ports"
    ;;
esac
