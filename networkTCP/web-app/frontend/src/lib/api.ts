export function getToken(){ return localStorage.getItem('token') }

export async function apiFetch(path:string, opts:any={}){
  const headers = opts.headers || {}
  const token = getToken()
  if(token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch('/api' + path, {...opts, headers})
  if(res.status === 401) {
    // simple handling
    localStorage.removeItem('token')
  }
  return res
}
