import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import React from "react";

// --- 补全缺少的语言配置定义 ---
const localesName = {
  en: "English",
  zh: "简体中文",
};

export default function Locales() { 
    // 将初始值设为当前语言
    const locale = useLocale();
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([locale]));
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (selectedLocale: string) => {
        if (selectedLocale !== locale) {
          // 这里的逻辑根据 next-intl 的路由配置进行跳转
          let newPathName = pathname;
          
          // 如果路径里包含当前语言前缀，先移除它
          if (pathname.startsWith(`/${locale}`)) {
            newPathName = pathname.replace(`/${locale}`, '');
          }
          
          // 确保路径至少有一个 /
          if (newPathName === '') {
            newPathName = '/';
          }
          
          // 使用 router.push 跳转到新语言页面
          router.push(newPathName, { locale: selectedLocale as any });
        }
      };

      return (
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="light"
              className="capitalize"
              startContent={<span role="img" aria-label="globe">🌏</span>}
              style={{ color: '#000000' }}
             >
              {/* 显示当前语言的名称，比如 "English" 或 "简体中文" */}
              {localesName[locale as keyof typeof localesName] || locale.toUpperCase()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            variant="faded"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
                setSelectedKeys(keys);
                const selectedValue = Array.from(keys)[0] as string;
                changeLanguage(selectedValue);
            }}
          >
            {Object.keys(localesName).map((item) => (
              <DropdownItem key={item} style={{ color: '#000000' }}>
                {localesName[item as keyof typeof localesName]}
              </DropdownItem>
            ))}
          </DropdownMenu>   
        </Dropdown>
      );
}