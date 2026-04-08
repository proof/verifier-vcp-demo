"use client";
import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";

// Sets up accessible key handling
const useHandleTabsKeydown = <T extends string>({
  tabs,
  tabRefs,
  onActivate,
}: {
  tabs: { key: T; label: string }[];
  tabRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  onActivate: (key: T) => void;
}) => {
  const handleKeyDown = (eventKey: string, tabIndex: number) => {
    let newIndex: number | null = null;
    if (eventKey === "ArrowLeft") {
      newIndex = tabIndex - 1 >= 0 ? tabIndex - 1 : tabs.length - 1;
    }
    if (eventKey === "ArrowRight") {
      newIndex = tabIndex + 1 < tabs.length ? tabIndex + 1 : 0;
    }
    if (newIndex !== null) {
      tabRefs.current[newIndex]?.focus();
      onActivate(tabs[newIndex].key);
    }
  };

  return { handleKeyDown };
};

// Pill-style tab switcher
export function PillTabs<T extends string>({
  tabs,
  selectedTab,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  selectedTab?: T;
  onChange?: (key: T) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<T>(selectedTab ?? tabs[0].key);

  useEffect(() => {
    if (selectedTab && selectedTab !== activeTab) {
      setActiveTab(selectedTab);
    }
    // Including activeTab would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  const activate = (key: T) => {
    setActiveTab(key);
    onChange?.(key);
  };

  const { handleKeyDown } = useHandleTabsKeydown({
    tabs,
    tabRefs,
    onActivate: activate,
  });

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-3 sm:gap-4">
      {tabs.map(({ key: tabKey, label }, i) => {
        const isActive = activeTab === tabKey;
        return (
          <button
            key={tabKey}
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-pressed={isActive}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => activate(tabKey)}
            onKeyDown={({ key }) => handleKeyDown(key, i)}
            className={clsx(
              "min-w-20 cursor-pointer rounded-full border-2 px-2 py-3 text-xs font-medium whitespace-nowrap transition-colors sm:rounded-full sm:p-4 sm:text-sm",
              isActive
                ? "bg-primary/75 hover:bg-primary border-primary text-white"
                : "border-white/20 bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// Tab switcher with an animated sliding indicator under the selected tab
export function Tabs({
  tabs,
  selectedTab,
}: {
  tabs: { key: string; label: string; content: React.ReactNode }[];
  selectedTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(selectedTab ?? tabs[0].key);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (selectedTab && selectedTab !== activeTab) {
      setActiveTab(selectedTab);
    }
    // Including activeTab would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.key === activeTab);
    const el = tabRefs.current[activeIndex];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab, tabs]);

  const { handleKeyDown } = useHandleTabsKeydown({
    tabs,
    tabRefs,
    onActivate: setActiveTab,
  });

  return (
    <div>
      <div className="relative mb-4 flex flex-wrap gap-x-2 border-b border-gray-700">
        <span>
          {tabs.map((tab, i) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-pressed={isActive}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={({ key }) => handleKeyDown(key, i)}
                className={clsx(
                  "cursor-pointer rounded px-1 pb-2 text-sm transition-colors duration-200",
                  isActive ? "font-bold text-white" : "text-gray-300",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </span>
        <div
          className="bg-primary absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={tab.key === activeTab ? "block" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
