import { Button } from "./components/ui/button";
import { useThemeStore } from "./stores";

function App() {
  const { toggleDarkMode, darkMode } = useThemeStore();

  const toggleDarkModeHandler = () => {
    console.log(darkMode);
    toggleDarkMode();
  };
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button onClick={toggleDarkModeHandler}>test</Button>
    </>
  );
}

export default App;
