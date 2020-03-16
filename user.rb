# frozen_string_literal: true

# Handles user perspective
class User
  # Encrypts a message given the public key
  #
  # message - Integer (Message to encrypt)
  # e_ - Integer (Public key)
  # n_ - Integer (Public key)
  #
  # Returns encrypted message - Integer
  def self.send_message(message, e_, n_)
    z = (message.to_i**e_.to_i) % n_.to_i
    z
  end
end
