"use client";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import dynamic from "next/dynamic";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FILE } from "../../dashboard/_components/DashboardTable";

const Editor = dynamic(() => import("../_components/Editor"), {
  ssr: false,
});

const Canvas = dynamic(() => import("../_components/Canvas"), {
  ssr: false,
});

const Workspace = ({ params }: any) => {
  const convex = useConvex();

  const [fileData, setfileData] = useState<FILE>();

  useEffect(() => {
    params.fileId && getFileData();
  }, []);

  const getFileData = async () => {
    const file = await convex.query(api.files.getFilebyId, {
      _id: params.fileId,
    });

    setfileData(file);
  };
  const Tabs = [
    {
      name: "Document",
    },
    {
      name: "AI",
    },
    {
      name: "Canvas",
    },
  ];

  const [activeTab, setActiveTab] = useState(Tabs[1].name);
  const [triggerSave, setTriggerSave] = useState(false);

  return (
    <div className="overflow-hidden w-full bg-[#4b2e19]">
      <WorkSpaceHeader
        Tabs={Tabs}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        onSave={() => setTriggerSave(!triggerSave)}
        file={fileData}
      />
      {activeTab === "Document" ? (
        <div
          style={{
            height: "calc(100vh - 3rem)",
            background: "#6e4b2a",
          }}
        >
          <Editor
            onSaveTrigger={triggerSave}
            fileId={params.fileId}
            fileData={fileData!}
          />
        </div>
      ) : activeTab === "Both" ? (
        <ResizablePanelGroup
          style={{
            height: "calc(100vh - 3rem)",
            background: "#6e4b2a",
          }}
          direction="horizontal"
        >
          <ResizablePanel defaultSize={50} minSize={40} collapsible={false}>
            <Editor
              onSaveTrigger={triggerSave}
              fileId={params.fileId}
              fileData={fileData!}
            />
          </ResizablePanel>
          <ResizableHandle className="bg-[#7c5c3e]" />
          <ResizablePanel defaultSize={50} minSize={45}>
            <Canvas
              onSaveTrigger={triggerSave}
              fileId={params.fileId}
              fileData={fileData!}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : activeTab === "Canvas" ? (
        <div
          style={{
            height: "calc(100vh - 3rem)",
            background: "#6e4b2a",
          }}
        >
          <Canvas
            onSaveTrigger={triggerSave}
            fileId={params.fileId}
            fileData={fileData!}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Workspace;
