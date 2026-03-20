"use client";
import { useAppContext } from "@/contexts/app";
import { useEffect, useState } from "react";
import { EffectResultInfo } from "@/backend/type/domain/effect_result_info";
import {
  Pagination,
  Modal,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import { EyeIcon } from "@nextui-org/shared-icons";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const { user } = useAppContext();
  const [effectResults, setEffectResults] = useState<EffectResultInfo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedResult, setSelectedResult] = useState<EffectResultInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;
  const [userSubscriptionInfo, setUserSubscriptionInfo] = useState<UserSubscriptionInfo | null>(null);
  const t = useTranslations("dashboard");

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    try {
      const res = await fetch("/api/user/get_user_subscription_info", {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUserSubscriptionInfo(data);
    } catch (e) { console.error(e); }
  };

  const fetchResults = async (pageNum: number) => {
    if (!user?.uuid) return;
    setIsLoading(true);
    try {
      const results = await fetch(
        `/api/effect_result/list_by_user_id?user_id=${user.uuid}&page=${pageNum}&page_size=${pageSize}`
      ).then((res) => res.json());
      setEffectResults(results);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const fetchCount = async () => {
    if (!user?.uuid) return;
    try {
      const data = await fetch(`/api/effect_result/count_all?user_id=${user.uuid}`).then(res => res.json());
      const count = parseInt(data.count);
      setTotalCount(count);
      setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
      fetchCount();
      fetchResults(page);
    }
  }, [user?.uuid, page]);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleViewResult = (result: EffectResultInfo) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400">
      <div className="container max-w-7xl mx-auto px-4 md:p-8 py-12 md:pb-24">
        
        {/* 页面标题 */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Creative Workspace & Assets</p>
        </div>

        {/* 订阅信息卡片：极简黑金/黑绿质感 */}
        {userSubscriptionInfo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { label: t("subscription.remainingCredits"), value: userSubscriptionInfo.remain_count, highlight: true },
              { label: t("subscription.planName"), value: userSubscriptionInfo.plan_name, highlight: false },
              { label: t("subscription.periodStart"), value: new Date(userSubscriptionInfo.current_period_start).toLocaleDateString(), highlight: false },
              { label: t("subscription.periodEnd"), value: userSubscriptionInfo.current_period_end ? new Date(userSubscriptionInfo.current_period_end).toLocaleDateString() : "N/A", highlight: false }
            ].map((item, i) => (
              <div key={i} className="vid-card p-6 flex flex-col justify-between min-h-[110px] border-white/[0.02]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{item.label}</span>
                <span className={`text-2xl md:text-3xl font-bold mt-2 tracking-tighter ${item.highlight ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-zinc-100'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 列表区域 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Spinner color="white" size="lg" /></div>
        ) : effectResults?.length > 0 ? (
          <div className="vid-card overflow-hidden border-white/[0.05]">
            <Table 
              removeWrapper
              aria-label="History"
              classNames={{
                th: "bg-zinc-900/40 text-zinc-500 border-b border-white/[0.05] py-5 text-[11px] font-bold tracking-widest uppercase text-center",
                td: "py-5 border-b border-white/[0.02] text-zinc-300 text-center text-sm",
              }}
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn className="text-left">FUNCTION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>CREDIT</TableColumn>
                <TableColumn>CREATED AT</TableColumn>
                <TableColumn>VIEW</TableColumn>
              </TableHeader>
              <TableBody>
                {effectResults.map((result, index) => (
                  <TableRow key={result.result_id} className="hover:bg-white/[0.02] transition-colors duration-300">
                    <TableCell className="text-zinc-600 font-mono">{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="text-left font-semibold text-zinc-100">{result.effect_name}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        result.status === "succeeded" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {result.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-400">{result.status === "succeeded" ? result.credit : "-"}</TableCell>
                    <TableCell className="text-zinc-500">{new Date(result.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                        onPress={() => handleViewResult(result)}
                        isDisabled={!result.url || result.status !== "succeeded"}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="vid-card flex flex-col items-center justify-center py-20 border-dashed">
            <div className="text-4xl mb-4 opacity-20">🕳️</div>
            <p className="text-zinc-500 font-light italic">No assets found. Start creating.</p>
          </div>
        )}

        {/* 分页 */}
        {totalCount > 0 && (
          <div className="flex justify-center mt-12">
            <Pagination
              total={totalPages}
              page={page}
              onChange={handlePageChange}
              size="sm"
              classNames={{
                wrapper: "gap-2",
                item: "bg-transparent text-zinc-500 hover:text-white",
                cursor: "bg-zinc-100 text-black font-bold",
              }}
            />
          </div>
        )}

        {/* 结果预览弹窗 */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          size="2xl" 
          backdrop="blur"
          classNames={{
            base: "bg-[#0a0a0a] border border-white/10 shadow-2xl",
            closeButton: "hover:bg-white/10 transition-colors"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <ModalBody className="p-6">
                {selectedResult?.url && (
                  <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    {selectedResult.url.match(/\.(mp4|webm|mov)/) || selectedResult.effect_name.includes('video') ? (
                      <video src={selectedResult.url} controls autoPlay className="w-full h-auto" />
                    ) : (
                      <img src={selectedResult.url} alt="Result" className="w-full h-auto" />
                    )}
                  </div>
                )}
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}