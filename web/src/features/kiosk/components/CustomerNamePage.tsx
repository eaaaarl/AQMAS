import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface KeyboardRef {
  setInput: (input: string) => void;
}

export default function CustomerNamePage() {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const [customerName, setCustomerName] = useState("");
  const keyboard = useRef<KeyboardRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get service IDs from URL parameters
  const serviceIds = searchParams.get('service_id')?.split(',') || [];

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setCustomerName(input);
    if (keyboard.current) {
      keyboard.current.setInput(input);
    }
  };

  const onKeyboardChange = (input: string) => {
    setCustomerName(input);
    if (inputRef.current) {
      inputRef.current.value = input;
    }
  };

  const handleSubmit = () => {
    if (customerName.trim()) {
      router(`/ticket?customer_name=${encodeURIComponent(customerName.trim())}&service_id=${serviceIds.join(',')}`);
    }
  };

  const handleBack = () => {
    router('/kiosk');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Enter Customer Name</h1>
          {serviceIds.length > 0 && (
            <p className="text-lg text-gray-600">
              Selected Services: {serviceIds.length} service(s)
            </p>
          )}
        </div>

        <div className="space-y-6">
          <input
            ref={inputRef}
            type="text"
            value={customerName}
            onChange={onInputChange}
            placeholder="Enter your name"
            className="w-full px-6 py-4 text-2xl border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500"
            maxLength={50}
          />

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-4 text-2xl font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!customerName.trim()}
              className="flex-1 px-6 py-4 text-2xl font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="w-full">
          <Keyboard
            keyboardRef={r => (keyboard.current = r)}
            onChange={onKeyboardChange}
            onKeyPress={button => {
              if (button === "{enter}") {
                handleSubmit();
              }
            }}
            layout={{
              default: [
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "{shift} z x c v b n m {backspace}",
                "{space} {enter}"
              ],
              shift: [
                "Q W E R T Y U I O P",
                "A S D F G H J K L",
                "{shift} Z X C V B N M {backspace}",
                "{space} {enter}"
              ]
            }}
            display={{
              "{enter}": "Enter",
              "{backspace}": "⌫",
              "{shift}": "⇧",
              "{space}": "Space"
            }}
            theme="hg-theme-default hg-layout-default"
            buttonTheme={[
              {
                class: "hg-red",
                buttons: "{backspace}"
              },
              {
                class: "hg-blue",
                buttons: "{enter} {shift}"
              }
            ]}
          />
        </div>
      </div>

      <style>{`
        .hg-theme-default {
          width: 100% !important;
          max-width: none !important;
          font-size: 18px !important;
        }
        
        .hg-theme-default .hg-button {
          height: 60px !important;
          min-width: 50px !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          margin: 4px !important;
        }
        
        .hg-theme-default .hg-button:active {
          background: #1e40af !important;
          color: white !important;
        }
        
        .hg-blue {
          background: #3b82f6 !important;
          color: white !important;
        }
        
        .hg-red {
          background: #ef4444 !important;
          color: white !important;
        }
        
        .hg-theme-default .hg-button.hg-functionBtn {
          background: #6b7280 !important;
          color: white !important;
        }
        
        .hg-theme-default .hg-button[data-skbtn="{space}"] {
          min-width: 200px !important;
        }
        
        .hg-theme-default .hg-button[data-skbtn="{enter}"],
        .hg-theme-default .hg-button[data-skbtn="{backspace}"] {
          min-width: 80px !important;
        }
      `}</style>
    </div>
  );
}