interface FormProps {
  onSymbolSelect: (symbol: string) => void;
}

function Form(props: FormProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">Form</div>
  );
}

export default Form;
