interface FormProps {
  onSymbolSelect: (symbol: string) => void;
}

function Form(props: FormProps) {
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose a stock symbol
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();

              const textField = document.getElementById(
                "symbol"
              ) as HTMLInputElement;

              const symbol = textField.value.toUpperCase();
              props.onSymbolSelect(symbol);
              document.title = symbol;
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Symbol{" "}
                <a
                  href="https://finance.yahoo.com/lookup"
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  (e.g. AAPL)
                </a>
              </label>
              <div className="mt-2">
                <input
                  id="symbol"
                  name="symbol"
                  type="text"
                  autoComplete="none"
                  required
                  autoFocus
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Start live view
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
