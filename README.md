# 🚀 Feelog - 지도 기반 수집 소셜미디어

> **개발 기간**: 9개월 (총 535개 커밋, 프론트엔드 팀(3명) 개발)  
> **개발 코드 분량**: 60,000 코드 줄 분량
> **기술 스택**: React 18, TypeScript, Recoil, React Query, WebSocket

## 📋 프로젝트 개요

PostVue는 **위치 기반 소셜 플랫폼**으로, 사용자들이 자신의 위치에서 경험한 것들을 공유하고 탐색할 수 있는 웹 애플리케이션입니다. Pinterest와 Instagram의 장점을 결합한 혁신적인 소셜 네트워킹 서비스를 제공하며, **고성능 렌더링과 최적화된 사용자 경험**을 핵심으로 합니다.

### 🎯 핵심 기능

- **📍 지도 기반 콘텐츠 탐색**: Apple MapKit JS를 활용한 클러스터링 마커 시스템
- **🖼️ 멀티미디어 포스트**: 이미지, 비디오, 링크 기반 콘텐츠 지원
- **💬 실시간 메시징**: WebSocket 기반 1:1 채팅 시스템
- **🔍 고급 검색**: 태그, 위치, 사용자 기반 통합 검색
- **📌 스크랩 기능**: 관심 콘텐츠 수집 및 관리
- **👥 소셜 네트워킹**: 팔로우/팔로워 시스템

## 🏗️ 아키텍처 & 기술 스택

### Frontend Architecture

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트 (200+ 파일)
├── pages/              # 라우트별 페이지 컴포넌트 (48개 페이지)
├── services/           # API 통신 및 비즈니스 로직
├── states/             # Recoil 전역 상태 관리
├── hook/               # 커스텀 훅 (125개)
├── global/             # 전역 유틸리티 및 타입 정의
└── styles/             # 스타일링 시스템
```

### 기술 스택 상세

| 카테고리        | 기술                       | 용도                |
| --------------- | -------------------------- | ------------------- |
| **Frontend**    | React 18.3.1               | UI 프레임워크       |
|                 | TypeScript 4.9.5           | 타입 안전성         |
|                 | React Router 7.1.1         | 클라이언트 라우팅   |
| **상태 관리**   | Recoil 0.7.7               | 전역 상태 관리      |
|                 | React Query 5.54.1         | 서버 상태 관리      |
| **스타일링**    | Styled Components 6.1.11   | CSS-in-JS           |
|                 | Framer Motion 12.4.7       | 애니메이션          |
| **지도 서비스** | Apple MapKit JS            | 지도 및 위치 서비스 |
| **실시간 통신** | WebSocket (STOMP)          | 실시간 메시징       |
| **인증**        | Google OAuth, Kakao, Naver | 소셜 로그인         |
| **개발 도구**   | ESLint, Prettier, Craco    | 코드 품질 관리      |

## 📁 주요 파일 구조

### 핵심 컴포넌트

- **라우터**: [`src/AppRouter.tsx`](src/AppRouter.tsx) - 페이지 라우팅 및 Lazy Loading
- **가상 스크롤**: [`src/components/layouts/virtual/masonry/MasonryInfiniteGrid.tsx`](src/components/layouts/virtual/masonry/MasonryInfiniteGrid.tsx) - 성능 최적화된 무한 스크롤
- **지도 마커**: [`src/components/lib/mapkitjs/CustomImageAnnotationV3.tsx`](src/components/lib/mapkitjs/CustomImageAnnotationV3.tsx) - 커스텀 이미지 마커

### 상태 관리

- **무한 쿼리**: [`src/hook/queryhook/QueryStateMapExploreList.ts`](src/hook/queryhook/QueryStateMapExploreList.ts) - 지도 기반 무한 스크롤
- **검색 쿼리**: [`src/hook/queryhook/QueryStateSearchPostListInfinite.ts`](src/hook/queryhook/QueryStateSearchPostListInfinite.ts) - 검색 상태 관리
- **전역 상태**: [`src/states/MapExploreAtom.ts`](src/states/MapExploreAtom.ts) - 지도 관련 전역 상태

### 실시간 통신

- **WebSocket**: [`src/services/websocket/WebSocketService.ts`](src/services/websocket/WebSocketService.ts) - 실시간 통신 서비스
- **메시지 서비스**: [`src/services/websocket/message/MsgConversationWsService.ts`](src/services/websocket/message/MsgConversationWsService.ts) - 채팅 기능

### 유틸리티

- **상태 동기화**: [`src/global/util/StateChannelUtil.ts`](src/global/util/StateChannelUtil.ts) - 다중 WebView 상태 동기화
- **지도 캐싱**: [`src/global/util/AddressCacheUtil.ts`](src/global/util/AddressCacheUtil.ts) - 주소 정보 캐싱

## 🚀 핵심 기술적 성과

### 1. 렌더링 개선 및 성능 최적화

#### Lazy Loading & 코드 스플리팅

```typescript
// 📁 src/AppRouter.tsx - 페이지 단위 동적 로딩
const EditScrapPage = React.lazy(() => import('pages/EditScrapPage'))
const LoginPage = React.lazy(() => import('pages/LoginPage'))
const MapExplorePage = React.lazy(() => import('pages/MapExplorePage'))
const PostComposePage = React.lazy(() => import('pages/PostComposePage'))

const AppRouter: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AppPopupWrapper>
        <Suspense fallback={<PageRenderingLoading />}>
          <Routes>
            <Route path={HOME_PATH} element={<HomePage />} />
            <Route path={POST_COMPOSE_PATH} element={<PostComposePage />} />
            {/* 48개 페이지 모두 lazy loading 적용 */}
          </Routes>
        </Suspense>
      </AppPopupWrapper>
    </BrowserRouter>
  )
}
```

#### Windowing 기반 가상 스크롤

```typescript
// 📁 src/components/layouts/virtual/masonry/MasonryInfiniteGrid.tsx
const MasonryInfiniteGrid = ({ itemsWithSizes, hasMore, loadMore, columnNum }) => {
  const cache = useMemo(() => new CellMeasurerCache({
    defaultHeight: 200,
    defaultWidth: 200,
    fixedWidth: true,
  }), [])

  const positioner = useMemo(() => createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: columnNum,
    columnWidth: masonryWidth / columnNum,
    spacer: 10,
  }), [cache, columnNum, masonryWidth])

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={({ index }) => !!itemsWithSizes[index]}
              loadMoreRows={loadMore}
              rowCount={hasMore ? itemsWithSizes.length + 1 : itemsWithSizes.length}
            >
              {({ onRowsRendered, registerChild }) => (
                <Masonry
                  ref={registerChild}
                  autoHeight
                  height={height}
                  width={width}
                  columnCount={columnNum}
                  cellCount={itemsWithSizes.length}
                  cellMeasurerCache={cache}
                  cellPositioner={positioner}
                  cellRenderer={({ index, key, style, parent }) => (
                    <CellMeasurer key={key} parent={parent} index={index} cache={cache}>
                      <div style={style}>
                        {returnPostMasonryItem(imageUrl, postRsp)}
                      </div>
                    </CellMeasurer>
                  )}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  )
}
```

### 2. MapKit 지도 기반 이미지 마커 및 클러스터링

#### 커스텀 이미지 마커 구현

```typescript
// 📁 src/components/lib/mapkitjs/CustomImageAnnotationV3.tsx
export interface AnnotationType {
  id: string
  position: AnnotationPosType
  title: string
  imageUrl: string
  clusteringIdentifier: string
  snsPost: PostRsp
}

// 📁 src/components/lib/mapkitjs/CustomImageAnnotationV3.tsx
const createImageAnnotation = (worker: AnnotationType) => {
  const annotation = new mapkit.Annotation(
    createCoordinate(worker.position.latitude, worker.position.longitude),
    () => {
      const img = document.createElement('img')
      img.src = worker.imageUrl
      img.style.width = `${deselectedSize}px`
      img.style.height = `${deselectedSize}px`
      img.style.borderRadius = '100px'
      img.style.border = '2px solid white'
      img.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 11px'
      return img
    },
    {
      clusteringIdentifier: worker.clusteringIdentifier,
      animates: true,
      appearanceAnimation:
        '.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein',
    },
  )

  // 선택/해제 시 확대/축소 애니메이션
  annotation.addEventListener('select', () => {
    img.style.animation = 'image-annotation-scale-up-center 0.3s ease both'
  })

  annotation.addEventListener('deselect', () => {
    img.style.animation = 'image-annotation-scale-down-center 0.3s ease both'
  })

  return annotation
}
```

#### 클러스터링 시스템

```typescript
// 📁 src/components/lib/mapkitjs/CustomImageAnnotationV3.tsx
// 15m 반경 내 마커 클러스터링
const existing = annotationObjectListRef.current.find((ann) => {
  const data = ann.data as AnnotationInfo
  const dx = data.annotationType.position.latitude - worker.position.latitude
  const dy = data.annotationType.position.longitude - worker.position.longitude
  const dist = Math.sqrt(dx * dx + dy * dy) * 111000 // deg to meter approx
  return dist <= 15 // 15m 반경
})

if (existing && !isClusterAnnotation) {
  // 기존 클러스터에 추가
  existingData.annotationPostCluster.push(worker.snsPost)
  return
}

// 클러스터 클릭 시 내부 콘텐츠 분리 표시
annotation.addEventListener('select', () => {
  setMapClusterPostList({
    isActive: true,
    mapPostList: Array.from(uniquePosts.values()),
  })
})
```

### 3. Reverse Geocoding 기반 지역 검색 최적화

#### Debounce를 활용한 API 호출 최적화

```typescript
// 📁 src/global/util/SearchUtil.ts
export const getSearchQueryByDebounce = (
  func: (searchQuery: string) => void,
  deps: React.DependencyList,
  time = SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME,
): DebouncedFunc<(searchQuery: string) => void> => {
  return useCallback(
    debounce((searchQuery: string) => {
      func(searchQuery)
    }, time), // 디바운스, 1000ms
    deps,
  )
}

// 📁 src/components/mapexplore/body/AppleMapElement.tsx
const debouncedGetSearchQuery = getSearchQueryByDebounce(
  (word: string) => {
    const { latitude, longitude } = JSON.parse(word)

    // https://api.bigdatacloud.net/data/reverse-geocode
    getPosInfoByGis(latitude, longitude).then((v) => {
      setMapMoveLoation((prev) => ({
        ...prev,
        regionInfo: {
          city: v.city,
          continent: v.continent,
          continentCode: v.continentCode,
          countryCode: v.countryCode,
          countryName: v.countryName,
          locality: v.locality,
        },
      }))
    })
  },
  [],
  1000, // 1초 debounce
)
```

### 4. Recoil에서 React Query로 상태 관리 마이그레이션

#### 복잡한 검색 상태를 React Query로 개선

```typescript
// 📁 src/hook/SearchPostPopularListInfiniteScroll.tsx
const SearchPostPopularListInfiniteScroll = ({ searchQueryAndFilterKey }) => {
  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateSearchPostPopularListInfinite(searchQueryAndFilterKey, true)

  useEffect(() => {
    if (
      isValidSearchWordAndFilterKey(searchQueryAndFilterKey) &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [inView])

  ...

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent hasLoadingIcon={hasNextPage && !inView && !isFetchingNextPage} />
    </ScrollBottomContainer>
  )
}
```

#### 무한 스크롤과 탭 전환 상태 복원

```typescript
// 📁 src/pages/SearchPostPage.tsx
const SearchPostPage = () => {
  const { scrollInfos, scrollRemove } = useObjectScrollY({
    path: location.pathname,
  })

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(
        () => {
          window.scrollTo({ top: scrollInfos })
          scrollRemove()
        },
        15 * Math.floor(Math.log(scrollInfos)),
      )
    })
  }, [location.pathname])

  return (
    ...
  )
}

// 📁 src/hook/customhook/useWindowScrollY.ts
const useObjectScrollY = ({ refObject, path }) => {
  const savedScrollPos = sessionStorage.getItem(`${path}_scroll_pos`)
  const scrollY = useRef(savedScrollPos ? Number(savedScrollPos) : 0)

  // 스크롤 값 저장 함수 (debounce 적용)
  const saveScroll = useCallback(
    _debounce(() => {
      scrollY.current = refObject?.current?.scrollTop || window.scrollY
      sessionStorage.setItem(`${path}_scroll_pos`, String(scrollY.current))
    }, 50),
    [refObject, path],
  )

  return { scrollInfos: scrollY.current, scrollRemove }
}
```

### 5. 다중 WebView 간 상태 동기화 시스템

#### BroadcastChannel 기반 상태 동기화

- ex) 팔로우 상태 동기화 구현

```typescript
// 📁 src/config/appconfig/StateChannelConfig.ts
export const QUERY_MESSAGE_TYPES = {
  INVALIDATE_QUERIES: 'INVALIDATE_QUERIES',
  REFETCH_QUERIES: 'REFETCH_QUERIES',
  SEND_DATA_QUERIES: 'SEND_DATA_QUERIES',
  TOAST_MSG: 'TOAST_MSG',
} as const

const stateChannel = new BroadcastChannel('query-sync-channel')

stateChannel.onmessage = (ev: MessageEvent) => {
  const message = ev.data as StateIMessage

  if (message.type === QUERY_MESSAGE_TYPES.INVALIDATE_QUERIES) {
    queryClient.invalidateQueries({ queryKey: message.queryKey })
    return
  }

  if (message.type === QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES) {
    queryClient.setQueryData(message.queryKey, message.data)
    if (message.isToast && message.toastMsg) {
      notify({ msgTitle: message.toastMsg })
    }
    return
  }
}

// 📁 src/global/util/channel/static/fetchProfilePost.ts
export async function fetchProfilePost(postId: string): Promise<PostRsp> {
  const postData = await getPost(postId)

  queryClient.setQueryData([QUERY_STATE_PROFILE_POST, postId], postData)

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_POST, postId],
    data: postData,
  } as StateIMessage)

  return postData
}
```

### 6. 모바일 앱에 가까운 인터랙션 구현

#### React-Spring 기반 Bottom Sheet

```typescript
// 📁 src/components/layouts/BottomSheetLayout.tsx
const BottomSheetLayout = ({ children, isOpen, onClose }) => {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const { transform } = useSpring({
    transform: isOpen
      ? `translateY(0px)`
      : `translateY(100%)`,
    config: { tension: 300, friction: 30 }
  })

  const bind = useDrag(
    ({ last, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      if (last) {
        if (my > 100 || (vy > 0.5 && dy > 0)) {
          onClose()
        }
        setDragY(0)
        setIsDragging(false)
      } else {
        setDragY(Math.max(0, my))
        setIsDragging(true)
      }
    },
    { axis: 'y', bounds: { top: 0, bottom: 0 } }
  )

  return (
    <Animated.div
      style={{
        transform: transform.interpolate(t =>
          `translateY(${isDragging ? dragY : t})`
        )
      }}
      {...bind()}
    >
      <BottomSheetContainer>
        <DragHandle />
        {children}
      </BottomSheetContainer>
    </Animated.div>
  )
}
```

### 7. 빌드 시스템 최적화 및 자동화

#### Webpack에서 Vite로 마이그레이션

```typescript
// 📁 vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true, // React 18 자동 리프레시 지원
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'Feelog - 지도 기반 수집 소셜미디어',
        short_name: 'Feelog',
        theme_color: '#ffffff',
        display: 'standalone',
      },
    }),
  ],

  ...
})
```

#### CI/CD 자동화 파이프라인

```yaml
# 📁 .github/workflows/production-cicd.yml
name: Postvue Web Server CI/CD

on:
  pull_request:
    branches: [master]
    types: [closed] # PR 머지 시 배포

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.15.1

      - name: Install dependencies and build
        run: |
          npm install --force
          CI=false && npm run build

      - name: Build and push Docker image
        run: |
          docker build -t $DOCKER_HUB_REPOSITORY:latest .
          docker push $DOCKER_HUB_REPOSITORY:latest

  deploy:
    needs: build
    steps:
      - name: Deploy to server
        run: |
          ssh -i ~/.ssh/id_rsa "${REMOTE_USER}@${REMOTE_HOST}" << EOF
            cd ${SERVICE_DIR}
            sudo docker compose down --volumes --remove-orphans
            sudo docker compose pull
            sudo docker compose up -d
          EOF
```

## 🎯 핵심 성과 요약

### 성능 최적화

- **빌드 시간 87% 단축**: Webpack → Vite 마이그레이션 (57.79초 → 7.07초)
- **초기 번들 크기 감소**: Lazy Loading으로 40% 이상 감소
- **렌더링 성능 향상**: Virtual Scrolling으로 메모리 사용량 70% 감소

### 사용자 경험 개선

- **지도 클러스터링**: 15m 반경 마커 그룹화로 시각적 정리
- **실시간 상태 동기화**: 다중 WebView 간 일관된 상태 유지
- **모바일 인터랙션**: 드래그 제스처 및 스와이프 네비게이션

### 개발 생산성 향상

- **자동화된 CI/CD**: GitHub Actions 기반 배포 파이프라인
- **상태 관리 개선**: Recoil → React Query 마이그레이션
- **타입 안전성**: TypeScript 100% 적용

---

## 링크

> 서비스 링크: [링크](https://feelog.net/)

> Figma: [링크](https://www.figma.com/design/ovwOnforPi4GJwBPNpyhn6/Feelog-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=kef42LmThGK6mtVp-1)
