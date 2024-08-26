import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);
  const {setTheme,theme} = useTheme();
  

  const handleToggle = () => {
    setIsOn(!isOn);
    if (theme == 'dark') setTheme('light');
    else if (theme == 'light') setTheme('dark')
    
  };

  useEffect(() => {
    if (theme === 'dark' && !isOn) {
      setIsOn(true);
    } else if (theme !== 'dark' && isOn) {
      setIsOn(false);
    }
  }, [theme, isOn]);

  return (
    <div
      onClick={handleToggle}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? 'bg-blue-500' : 'bg-gray-500'
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
}

export default ToggleSwitch;