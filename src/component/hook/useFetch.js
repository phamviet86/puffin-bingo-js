// path: @/component/hook/useFetch.js

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { fetchList, fetchGet } from "@/lib/util/fetch-util";

// Constants
const MAX_CACHE_SIZE = 100;
const CACHE_PERSIST_INTERVAL = 60000; // 1 phút
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 1 tuần tính bằng milliseconds

// Cache store để lưu trữ kết quả của các request
const cacheStore = new Map();

// Khởi tạo cache từ localStorage nếu có
const initializeCache = () => {
  if (typeof window !== "undefined") {
    try {
      const persistedCache = localStorage.getItem("fetchDataCache");
      if (persistedCache) {
        const parsed = JSON.parse(persistedCache);

        // Restore cache với cấu trúc Map
        Object.entries(parsed).forEach(([key, value]) => {
          cacheStore.set(key, value);
        });

        // Dọn dẹp các entry hết hạn và cache cũ hơn 1 tuần
        const now = Date.now();
        const oneWeekAgo = now - ONE_WEEK_IN_MS;

        for (const [key, value] of cacheStore.entries()) {
          // Xóa nếu cache đã hết hạn hoặc cũ hơn 1 tuần
          if (value.expiry < now || value.timestamp < oneWeekAgo) {
            cacheStore.delete(key);
          }
        }
      }
    } catch (error) {
      console.error("Error restoring cache from localStorage:", error);
    }
  }
};

// Lưu cache vào localStorage
const persistCache = () => {
  if (typeof window !== "undefined") {
    try {
      const cacheObject = Object.fromEntries(cacheStore.entries());
      localStorage.setItem("fetchDataCache", JSON.stringify(cacheObject));
    } catch (error) {
      console.error("Error persisting cache to localStorage:", error);
    }
  }
};

// Helper function để dọn dẹp cache khi kích thước vượt quá ngưỡng
const cleanupCache = () => {
  if (cacheStore.size > MAX_CACHE_SIZE) {
    // Tìm và xóa các entries cũ nhất dựa vào expiry time
    const entries = Array.from(cacheStore.entries()).sort(
      (a, b) => a[1].expiry - b[1].expiry
    );

    // Xóa 20% cache entries cũ nhất
    const deleteCount = Math.floor(MAX_CACHE_SIZE * 0.2);
    for (let i = 0; i < deleteCount; i++) {
      if (entries[i]) cacheStore.delete(entries[i][0]);
    }
  }

  // Hard expiry: Xóa toàn bộ cache cũ hơn 1 tuần
  const now = Date.now();
  const oneWeekAgo = now - ONE_WEEK_IN_MS;

  for (const [key, value] of cacheStore.entries()) {
    if (value.timestamp < oneWeekAgo) {
      cacheStore.delete(key);
    }
  }
};

// Khởi tạo cache khi module được load
if (typeof window !== "undefined") {
  initializeCache();
  // Định kỳ lưu cache
  setInterval(persistCache, CACHE_PERSIST_INTERVAL);
  // Định kỳ dọn dẹp cache cũ (thực hiện mỗi ngày)
  setInterval(cleanupCache, 24 * 60 * 60 * 1000);
}

function useDataCache(cacheKey, fetchFunction, cacheTime = null) {
  const useCache = cacheTime !== null && cacheTime > 0;
  const cacheTTL = useCache ? cacheTime * 1000 : 0;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Track if we've fetched during this component instance
  const hasFetched = useRef(false);

  // Track ongoing fetch operations to prevent duplicate requests
  const fetchInProgress = useRef(false);

  // Xóa cache với cacheKey hiện tại nếu cacheTime là null hoặc 0
  useEffect(() => {
    if (!useCache) {
      cacheStore.delete(cacheKey);
      persistCache();
    }
  }, [cacheKey, useCache]);

  const executeFetch = useCallback(
    async (skipCache = false, updateLoading = true) => {
      // Ngăn chặn nhiều fetches đồng thời cho cùng một dữ liệu
      if (fetchInProgress.current) {
        return;
      }

      try {
        fetchInProgress.current = true;
        // Only update loading state if updateLoading is true
        if (updateLoading) {
          setLoading(true);
        }
        setError(false);

        // Kiểm tra cache nếu useCache=true và không yêu cầu skipCache
        if (useCache && !skipCache) {
          const cachedData = cacheStore.get(cacheKey);

          if (cachedData) {
            // Trả về cached data ngay lập tức nếu chưa hết hạn
            if (Date.now() < cachedData.expiry) {
              // Return raw data without extracting
              setData(cachedData.data);
              if (updateLoading) {
                setLoading(false);
              }

              // Nếu data gần hết hạn (< 20% thời gian còn lại), fetch mới trong nền
              const timeLeft = cachedData.expiry - Date.now();
              const threshold = cacheTTL * 0.2;

              if (timeLeft < threshold) {
                // Thực hiện revalidate trong nền không cần đợi
                setTimeout(() => {
                  executeFetch(true, false);
                }, 0);
              }

              fetchInProgress.current = false;
              return;
            }
            // Nếu data đã hết hạn, tiếp tục fetch mới
          }
        }

        // Cache miss hoặc data expired, fetch mới
        const result = await fetchFunction();

        // Lưu vào cache nếu useCache=true
        if (useCache) {
          cacheStore.set(cacheKey, {
            data: result,
            expiry: Date.now() + cacheTTL,
            timestamp: Date.now(), // Thêm thời gian tạo cache cho hard expiry
          });
          cleanupCache();
          persistCache();
        }

        // Return raw result without extracting data.data
        setData(result);
        if (updateLoading) {
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error in useDataCache:`, err);
        setError(true);
        if (updateLoading) {
          setLoading(false);
        }
      } finally {
        fetchInProgress.current = false;
        hasFetched.current = true;
      }
    },
    [cacheKey, useCache, cacheTTL, fetchFunction]
  );

  useEffect(() => {
    // Only fetch if we haven't fetched for this component instance
    if (!hasFetched.current) {
      executeFetch();
    }

    // Chỉ thêm event listener focus nếu sử dụng cache
    if (useCache && typeof window !== "undefined") {
      // Refresh data khi window focus lại sau khoảng thời gian dài
      let lastFocusTime = Date.now();

      const handleFocus = () => {
        const now = Date.now();
        // Nếu tab inactive quá 5 phút, refresh data
        if (now - lastFocusTime > 5 * 60 * 1000) {
          executeFetch(true, false); // Don't update loading on auto-refresh
        }
        lastFocusTime = now;
      };

      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [cacheKey, useCache, executeFetch]);

  // Cung cấp hàm refresh để client có thể refresh data khi cần
  const refresh = useCallback(() => executeFetch(true, false), [executeFetch]);

  return { data, loading, error, refresh };
}

export function useFetch() {
  const useFetchList = (
    url,
    params,
    sort = {},
    filter = {},
    cacheTime = 300
  ) => {
    // Tạo một cacheKey duy nhất dựa trên các tham số
    const cacheKey = useMemo(() => {
      return `LIST:${url}:${JSON.stringify({ params, sort, filter })}`;
    }, [url, params, sort, filter]);

    // Tạo hàm fetch
    const fetchFunction = useCallback(() => {
      return fetchList(url, params, sort, filter);
    }, [url, params, sort, filter]);

    const { data, loading, error, refresh } = useDataCache(
      cacheKey,
      fetchFunction,
      cacheTime
    );

    // Process data for useFetchList
    const processedData = useMemo(() => {
      return data?.data || null;
    }, [data]);

    return {
      data: processedData,
      loading,
      error,
      reload: refresh,
    };
  };

  const useFetchGet = (url, cacheTime = 60) => {
    // Tạo một cacheKey duy nhất dựa trên các tham số
    const cacheKey = useMemo(() => {
      return `GET:${url}`;
    }, [url]);

    // Tạo hàm fetch
    const fetchFunction = useCallback(() => {
      return fetchGet(url);
    }, [url]);

    const { data, loading, error, refresh } = useDataCache(
      cacheKey,
      fetchFunction,
      cacheTime
    );

    // Process data for useFetchGet - extract first item from data array
    const processedData = useMemo(() => {
      return data?.data?.[0] || null;
    }, [data]);

    return {
      data: processedData,
      loading,
      error,
      reload: refresh,
    };
  };

  return { useFetchList, useFetchGet };
}
