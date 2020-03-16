const scheme = "ws://";
var uri = scheme + window.document.location.host + "/";
var count = 0;
var e
var n


function connectWebsocket() {
  var wrapper = document.getElementById('log');
  const ws = new WebSocket(uri);
  useWebSocket(ws, wrapper);

  setTimeout(function () {
    z = document.getElementById('pq_form');
    z.addEventListener("submit", function (event) {
      event.preventDefault();
      enableLoading()
      var wrapper = document.getElementById('log');
      temp = document.createElement('p')
      temp.innerHTML = 'Calculating keys..'
      wrapper.append(z)

      holder = {}
      Array.from(z.children).forEach((element) => {
        if (element.placeholder == 'Q' || element.placeholder == 'P') {
          console.log(element.placeholder.toString())
          holder[element.placeholder.toString()] = element.value
        }
      })
      ws.send(JSON.stringify(holder))
    })

  }, 1000)
}


function useWebSocket(ws, wrapper) {
  if (ws && count < 2) {
    ws.onopen = function () {
      count = 0;
      if (document.querySelectorAll('p').length == 0) {
        z = document.createElement('p');
        z.innerHTML = "Bank connection established.";
        wrapper.append(z);

        z = document.createElement('p');
        z.innerHTML = 'Enter two prime numbers';
        wrapper.append(z);

        temp = document.createElement('form');
        temp.id = "pq_form";

        z = document.createElement('input');
        z.placeholder = 'P';
        temp.append(z);
        z = document.createElement('input');
        z.placeholder = 'Q';
        temp.append(z);
        z = document.createElement('button');
        z.innerHTML = 'Submit';
        temp.append(z);
        wrapper.append(temp)
      }
    }


    ws.onmessage = function (message) {
      console.log(message.data)
      response = JSON.parse(JSON.stringify(message.data));
      response = JSON.parse(response)
      console.log(response)
      if (Object.keys(response).includes('keys')) {
        disableLoading()
        z = document.createElement('p');
        e = response.keys.e
        z.innerHTML = "E:" + e;
        wrapper.append(z)
        z = document.createElement('p');
        n = response.keys.n
        z.innerHTML = "N:" + n;
        wrapper.append(z)
        z = document.createElement('p');
        m = response.keys.m
        z.innerHTML = "M:" + m;
        z.classList.add('private')
        wrapper.append(z)
        z = document.createElement('p');
        d = response.keys.d
        z.innerHTML = "D:" + d;
        z.classList.add('private')
        wrapper.append(z)

        temp = document.createElement('form');
        temp.id = "message_form";

        z = document.createElement('input');
        z.placeholder = 'Message';
        temp.append(z);
        z = document.createElement('button');
        z.innerHTML = 'Submit';
        temp.addEventListener("submit", function (event) {
          event.preventDefault();
          q = document.getElementById('message_form').childNodes[0];
          ws.send(JSON.stringify({
            'encrypt': q.value,
            'e': e,
            'n': n
          }))

          // c = encrypt(q.value, e, n);

        });
        temp.append(z);
        wrapper.append(temp);

      } else if (Object.keys(response).includes('encrypted')) {
        c = response['encrypted']
        x = JSON.stringify({
          'message': response['encrypted']
        });
        temp = document.createElement('p');
        temp.innerHTML = "Encrypted message: " + c;
        wrapper.append(temp);
        ws.send(x);

      } else if (Object.keys(response).includes('message')) {
        z = document.createElement('p');
        z.innerHTML = response['message'];
        wrapper.append(z);

      } else if (Object.keys(response).includes('decrypted')) {
        q = document.createElement('p');
        q.classList.add('private');
        q.innerHTML = 'Decrypted to: ' + response['decrypted'];
        wrapper.append(q);
      }

    }

    ws.onclose = function () {
      console.log('Disconnected from ws')
      if (document.getElementById('connection_lost') == null) {
        z = document.createElement('p');
        z.id = 'connection_lost';
        z.innerHTML = "Bank connection lost. <br>Reload the page to reconnect";
        wrapper.append(z);
      }
      setTimeout(connectWebsocket(), 10000)
    }
  } else {
    setTimeout(connectWebsocket(), 15000)
  }
}
document.addEventListener('DOMContentLoaded', (event) => {
  connectWebsocket()
})

function disableLoading() {
  temp = document.querySelector('.lds-ellipsis');
  temp.innerHTML = ''
  temp.outerHTML = ''
}

function enableLoading() {
  console.log('enabled')
  let z = document.createElement('div')
  z.classList.add('lds-ellipsis')
  z.innerHTML = "<div></div><div></div><div></div><div></div>"
  document.querySelector('body').append(z)
}

function encrypt(message, e, n) {
  console.log('Calculating...')
  enableLoading()
  temp = new BigNumber(message)
  console.log('temp')
  temp2 = temp.pow(e)
  console.log('temp2')
  z = temp2.modulo(n)
  console.log('Calculated')
  return z
}