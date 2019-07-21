---

---

## SSR

```javascript
window.__APOLLO_STATE__ = JSON.stringify(client.cache.extract())

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link,
})
```

## ReactDOM.renderToString(App)

## ApolloReact.renderToStringWithData(App)
