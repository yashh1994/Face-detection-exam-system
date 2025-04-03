from cryptography.fernet import Fernet

key = b'W8Jq_k-8Z2XwP8bO9N6j0S1W9WkF7B2XKwWFF5o9UgM='

# Initialize the Fernet cipher suite
cipher_suite = Fernet(key)

def encrypt_decrypt(data, action="encode"):
    if action == "encode":
        # Encode (encrypt) the data
        encoded_data = cipher_suite.encrypt(data.encode())
        return encoded_data.decode()  # Return as string

    elif action == "decode":
        # Decode (decrypt) the data
        decoded_data = cipher_suite.decrypt(data.encode())
        return decoded_data.decode()  # Return as string

    else:
        raise ValueError("Action must be either 'encode' or 'decode'")


