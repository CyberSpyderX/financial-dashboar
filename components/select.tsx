"use client";

import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    options?: { label: string; item: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
};

export const Select = ({
    value,
    onChange,
    onCreate,
    disabled,
    placeholder,
    options = []
}: Props) => {
    const onSelect = (option: SingleValue<{ label: string; item: string }>) => {
        onChange(option?.item);
    };

    const formattedValue = useMemo(() => {
        return options.find((option) => option.item === value);
    }, [options, value]);

    return (
        <CreatableSelect
            placeholder={placeholder}
            className='text-sm h-10'
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": {
                        borderColor: '#e2e8f0'
                    }
                })
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}