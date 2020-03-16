# frozen_string_literal: true

require 'prime'

# Handles bank perspective
class Bank
  attr_reader :e_, :n_, :d_, :m_

  # Initializes a instance of bank
  #
  # p_ - Integer (Primenumber)
  # q_ - Integer (Primenumber)
  #
  # Returns nothing
  def initialize(p_, q_)
    p_ = p_.to_i
    q_ = q_.to_i

    raise 'Did not provide two primes' unless Prime.prime?(p_) && Prime.prime?(q_)

    @n_ = p_ * q_
    @m_ = (p_ - 1) * (q_ - 1)
    @e_ = @m_ - 1

    running = true
    while running
      running = false if Prime.prime?(@e_)
      break unless running

      @e_ -= 1
    end

    # Based upon @itggot-david-jensen implementation
    @d_ = 2
    @d_ += 1 while (@e_ * @d_) % @m_ != 1
    raise 'D value is to large' if @d_ >= @m_
  end

  # Decrypts a message
  #
  # message - Integer (Message to decrypt)
  # d - Integer, Optional (d value)
  # n - Integer, Optional (n value)
  #
  # Returns decrypted message - Integer
  def retrieve(message, d = @d_, n = @n_)
    message = message.to_i
    (message.to_i**d.to_i) % n.to_i
  end
end
