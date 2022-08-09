# Utilities
Octobox has a few various utilities and plans to add more in the future as needed.

## Forms
Octobox comes with a `<Form/>` element, which renders a HTML form. Its children should just be normal form elements. The form's data is handled by the prop `handler`. For example:
```tsx
<Form handler={async (results) => {
  const auth = process(results.username, results.password);
  if(auth) {
    redirect({ to: "/profile" });
  }else{
    redirect({ to: "/login" });
  }
}}>
  <label>
    Username:
    <input name={"username"} type={"text"} id={"username"}/>
  </label>
  <label>
    Password:
    <input name={"password"} type={"password"} id={"password"}/>
  </label>
  <button type={"submit"} id={"submit"}>Submit</button>
</Form>
```

## Scrolling
You can scroll to a specific coordinate in the DOM with the `useScroll(x?, y?);` hook.

## Spacing
You can create empty space with the `<Spacer height={...} width={...}/>` component. The height and width can be defined by any valid CSS distances like `70px`, `3em`, etc.

## UUID Generation
You can generate a random UUID with the `useUUID()` hook.

## Sleeping
You can pause an async function for a specific amount of time by calling `await useSleep(milliseconds)`.

## Development Mode Checker
You can check if you're in development mode or production mode with the `useDevelopmentModeStatus()` hook.
