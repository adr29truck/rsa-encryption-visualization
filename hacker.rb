# frozen_string_literal: true

# Hacker perspective
class Hacker
  # Cracks RSA encryption
  #
  # message - Integer (Message to decrypt)
  # e_ - Integer (Public key)
  # n_ - Integer (Public key)
  #
  # Returns cracked message
  def self.crack(message, e_, n_)
    running = true
    x = 1
    while running
      z = (message**x) % n_
      running = false if ((z**e_) % n_) == message
      x += 1
    end
    z
  end
end
