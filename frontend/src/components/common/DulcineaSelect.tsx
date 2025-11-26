import Select, { ActionMeta, SingleValue } from "react-select";

interface DulcineaSelectProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
  options: SelectOption[];
  defaultValue?: SelectOption;
  value?: SelectOption | null;
  onChange: (
    newValue: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
}

const DulcineaSelect: React.FC<DulcineaSelectProps> = ({
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  placeholder = "Search...",
  defaultValue,
  value,
  options,
  onChange,
  ...props
}) => {
  return (
    <Select
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      defaultValue={defaultValue}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default DulcineaSelect;
