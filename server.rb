# frozen_string_literal: true

require 'prime'
require 'faye'
require 'sinatra'
require 'slim'
require 'eventmachine'
require 'json'

require_relative 'bank'
require_relative 'user'

# Handles the application runtime
class App < Sinatra::Base
  enable :sessions

  clients = []

  get '/?' do
    if Faye::WebSocket.websocket?(request.env)
      ws = Faye::WebSocket.new(request.env)
      ws.on(:open) do |event|
      end

      ws.on(:message) do |msg|
        x = JSON.parse(JSON.parse(msg.data.to_json))
        if x.keys.include?('P')
          begin
            @bank = Bank.new(x['P'], x['Q'])
            clients << { ws: ws, bank: @bank }
            Websocket.send_keys(ws, @bank)
          rescue StandardError => e
            p e
            ws.send({ 'message': 'That was not two primes.' }.to_json)
          end
        elsif x.keys.include?('encrypt')
          begin
            temp = User.send_message(x['encrypt'], x['e'], x['n'])
            ws.send({ 'encrypted': temp }.to_json)
          rescue StandardError => e
            p e
            ws.send({ 'message': 'Value is too large. Unable to calculate.' }.to_json)
          end
        elsif x.keys.include?('message')
          clients.each do |hash|
            @bank = (hash[:bank] if hash[:ws] == ws)
          end
          z = @bank.retrieve(x['message'].to_i)
          ws.send({ 'decrypted': z }.to_json)
        end
      end

      ws.on(:close) do |_event|
      end

      ws.rack_response
    else
      slim :index
    end
  end
end
