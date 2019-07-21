# mermaid 

``` mermaid
flowchart TB
  A(圆角) --> B[方角]
  B --> C
  C --- D
  D --- E
  D -.-> E
  E -->|字|F
  F --> A

```

``` mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ff0000'}}}%%
  graph TD
    a --> b
```