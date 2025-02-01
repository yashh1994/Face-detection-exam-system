def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True
def is_palidrome(s):
    return s == s[::-1]
def get_primes(n):
    return [x for x in range(n) if is_prime(x)]
def get_palindromes(n):
    return [x for x in range(n) if is_palindrome(str(x))]
