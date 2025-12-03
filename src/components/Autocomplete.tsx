import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';

interface AutocompleteOption {
  id: string;
  name: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Autocomplete = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  icon,
  disabled = false,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const normalizeText = (text: string) => {
    return text
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  };

  const selectedOption = value ? options.find(opt => opt.id === value) : undefined;

  const filteredOptions = options.filter(option => {
    const normalizedOption = normalizeText(option.name);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedOption.includes(normalizedSearch);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (value) {
      onChange('');
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const displayValue = selectedOption ? selectedOption.name : searchTerm;

  return (
    <div ref={wrapperRef} className="relative group">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">
        {label}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition pointer-events-none z-10">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined}
          className={clsx(
            "w-full bg-gray-50 dark:bg-gray-700 border text-gray-900 dark:text-gray-100 text-base rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent block p-3 transition hover:bg-gray-100 dark:hover:bg-gray-600 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500",
            icon ? "pl-10" : "pl-4",
            value || searchTerm ? "pr-20" : "pr-10",
            error ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-600",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(value || searchTerm) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          )}
          <ChevronDown 
            className={clsx(
              "w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform pointer-events-none",
              isOpen && "rotate-180"
            )} 
          />
        </div>

        {isOpen && !disabled && (
          <ul
            ref={listRef}
            id="autocomplete-listbox"
            role="listbox"
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-auto"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-gray-400 dark:text-gray-500 text-sm text-center">
                Sonuç bulunamadı
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.id}
                  id={`option-${index}`}
                  role="option"
                  aria-selected={option.id === value}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={clsx(
                    "px-4 py-3 cursor-pointer transition text-sm",
                    highlightedIndex === index && "bg-blue-50 dark:bg-blue-900/30",
                    option.id === value && "bg-blue-100 dark:bg-blue-900 font-semibold text-blue-700 dark:text-blue-300",
                    option.id !== value && "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  )}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};

