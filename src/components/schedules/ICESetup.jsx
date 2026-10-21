import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";

const IceSetup = ({
  companyName,
  companyAddress,
  onNavigate,
  onSaveSuccess,
}) => {
  const [setupData, setSetupData] = useState(null);

  const handleAddPrimaryIndirectPool = () => {
    setSetupData((current) => {
      if (!current) return current;

      const pools = [...(current.pools ?? [])];
      const primaryPool = pools[0] ?? {};
      const maxDisplayOrder = pools.reduce(
        (max, pool) => Math.max(max, Number(pool.displayOrder) || 0),
        0,
      );

      pools.push({
        id: 0,
        poolType: primaryPool.poolType,
        isUsed: false,
        poolName: "",
        shortName: "",
        displayOrder: maxDisplayOrder + 1,
        isNewPrimaryIndirect: true,
        tempId: `new-primary-${Date.now()}-${Math.random()}`,
      });

      return {
        ...current,
        pools,
      };
    });
  };

  const handleAddFringePool = () => {
    setSetupData((current) => {
      if (!current) return current;

      const pools = [...(current.pools ?? [])];
      const fringePool = pools[4] ?? {};
      const maxDisplayOrder = pools.reduce(
        (max, pool) => Math.max(max, Number(pool.displayOrder) || 0),
        0,
      );

      pools.push({
        id: 0,
        poolType: fringePool.poolType,
        isUsed: false,
        poolName: "",
        shortName: "",
        displayOrder: maxDisplayOrder + 1,
        isNewFringe: true,
        tempId: `new-fringe-${Date.now()}-${Math.random()}`,
      });

      return {
        ...current,
        pools,
      };
    });
  };

  const handleAddIntermediatePool = () => {
    setSetupData((current) => {
      if (!current) return current;

      const pools = [...(current.pools ?? [])];
      const intermediatePool = pools[5] ?? {};
      const maxDisplayOrder = pools.reduce(
        (max, pool) => Math.max(max, Number(pool.displayOrder) || 0),
        0,
      );

      pools.push({
        id: 0,
        poolType: intermediatePool.poolType,
        isUsed: false,
        poolName: "",
        shortName: "",
        displayOrder: maxDisplayOrder + 1,
        isNewIntermediate: true,
        tempId: `new-intermediate-${Date.now()}-${Math.random()}`,
      });

      return {
        ...current,
        pools,
      };
    });
  };

  const handleClearPrimaryIndirectPools = () => {
    setSetupData((current) => {
      if (!current) return current;

      return {
        ...current,
        pools: (current.pools ?? []).filter(
          (pool) => !pool.isNewPrimaryIndirect,
        ),
      };
    });
  };

  const handleClearFringePools = () => {
    setSetupData((current) => {
      if (!current) return current;

      return {
        ...current,
        pools: (current.pools ?? []).filter((pool) => !pool.isNewFringe),
      };
    });
  };

  const handleClearIntermediatePools = () => {
    setSetupData((current) => {
      if (!current) return current;

      return {
        ...current,
        pools: (current.pools ?? []).filter((pool) => !pool.isNewIntermediate),
      };
    });
  };

  const handleRunSetup = async () => {
    try {
      const payload = {
        ...setupData,
        fiscalYearEndDate: setupData?.fiscalYearEndDate || "12/31/25",
        pools: (setupData?.pools ?? []).map(
          ({
            isNewPrimaryIndirect,
            isNewFringe,
            isNewIntermediate,
            tempId,
            ...pool
          }) => pool,
        ),
      };

      const response = await axios.post(
        `${backendUrl}/api/IceReportSetUp`,
        payload,
      );

      if (onSaveSuccess) {
        await onSaveSuccess();
      }

      console.log("Run Setup response:", response.data);
    } catch (error) {
      console.error("Error running ICE setup:", error);
    }
  };

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/IceReportSetUp`);

        console.log("ICE Setup:", response.data);

        setSetupData(response.data);
      } catch (error) {
        console.error("Error fetching ICE setup:", error);
      }
    };

    fetchSetup();
  }, []);

  return (
    <div className="p-4 bg-[#80b0ff] min-h-screen text-black font-sans text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Form & Tables */}
        <div className="w-full md:w-3/4 space-y-3">
          {/* General Information Section */}
          <div>
            <h2 className="italic font-bold text-purple-900 text-sm mb-1">
              General Information:
            </h2>
            <table className="border-collapse border border-black bg-white w-full max-w-lg">
              <tbody>
                <tr className="border-b border-black">
                  <td className="bg-[#d9d9d9] font-bold italic p-1 border-r border-black w-40">
                    Company Name:
                  </td>
                  <td className="p-1 font-medium">{companyName}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="bg-[#d9d9d9] font-bold italic p-1 border-r border-black">
                    Company Location:
                  </td>
                  <td className="p-1 font-medium">{companyAddress}</td>
                </tr>
                <tr>
                  <td className="bg-[#d9d9d9] font-bold italic p-1 border-r border-black">
                    Fiscal Year End Date:
                  </td>
                  <td className="p-1 font-medium bg-[#ffffcc]">
                    <input
                      type="date"
                      value={
                        setupData?.fiscalYearEndDate
                          ? new Date(setupData.fiscalYearEndDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setSetupData((current) => ({
                          ...current,
                          fiscalYearEndDate: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent outline-none font-medium text-xs cursor-pointer"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Accounting Practices Section */}
          <div>
            <h2 className="italic font-bold text-purple-900 text-sm mb-1">
              Accounting Practices{" "}
              <span className="font-normal">(Check all that apply) :</span>
            </h2>
            <div className="bg-[#ffffcc] border border-black p-2 space-y-1.5 max-w-2xl">
              <label className="flex items-center space-x-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={setupData?.useValueAddedGnaBase || false}
                  onChange={(e) =>
                    setSetupData((current) => ({
                      ...current,
                      useValueAddedGnaBase: e.target.checked,
                    }))
                  }
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span>
                  Value-added G&amp;A base is used instead of Total Cost Input
                </span>
              </label>

              <label className="flex items-center space-x-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    setupData?.finalIndirectPoolCostsByDepartment || false
                  }
                  onChange={(e) =>
                    setSetupData((current) => ({
                      ...current,
                      finalIndirectPoolCostsByDepartment: e.target.checked,
                    }))
                  }
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span>
                  Final indirect pool costs are accumulated by Department
                </span>
              </label>

              <label className="flex items-center space-x-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    setupData?.materialSubcontractAsFinalIndirectPoolBase ||
                    false
                  }
                  onChange={(e) =>
                    setSetupData((current) => ({
                      ...current,
                      materialSubcontractAsFinalIndirectPoolBase:
                        e.target.checked,
                    }))
                  }
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span>
                  There is a final indirect pool with Material/Subcontracts
                  costs as an allocation base
                </span>
              </label>

              <label className="flex items-center space-x-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={setupData?.separateFringePool || false}
                  onChange={(e) =>
                    setSetupData((current) => ({
                      ...current,
                      separateFringePool: e.target.checked,
                    }))
                  }
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span>There is a separate pool to allocate fringe costs</span>
              </label>
            </div>
          </div>

          {/* Select Number of Pools/Rates */}
          <div>
            <h2 className="italic font-bold text-purple-900 text-sm mb-1">
              Select the number of pools/rates:
            </h2>
            <table className="border-collapse border border-black bg-white w-full max-w-2xl text-[11px]">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-16 text-center border-r border-black bg-[#ffffcc] font-bold">
                    <input
                      type="number"
                      value={setupData?.numberOfIndirectLaborPools ?? ""}
                      onChange={(e) =>
                        setSetupData((current) => ({
                          ...current,
                          numberOfIndirectLaborPools: Number(e.target.value),
                        }))
                      }
                      className="w-full text-center bg-transparent outline-none"
                    />
                  </td>
                  <td className="p-1 font-bold">
                    Number of Indirect Pools with labor dollars as an allocation
                    base
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="w-16 text-center border-r border-black bg-[#ffffcc] font-bold">
                    <input
                      type="number"
                      value={setupData?.numberOfIntermediatePools ?? ""}
                      onChange={(e) =>
                        setSetupData((current) => ({
                          ...current,
                          numberOfIntermediatePools: Number(e.target.value),
                        }))
                      }
                      className="w-full text-center bg-transparent outline-none"
                    />
                  </td>
                  <td className="p-1 font-bold">
                    Number of Intermediate Pools
                  </td>
                </tr>
                <tr>
                  <td className="w-16 text-center border-r border-black bg-[#ffffcc] font-bold">
                    <input
                      type="number"
                      value={setupData?.numberOfCostOfMoneyRates ?? ""}
                      onChange={(e) =>
                        setSetupData((current) => ({
                          ...current,
                          numberOfCostOfMoneyRates: Number(e.target.value),
                        }))
                      }
                      className="w-full text-center bg-transparent outline-none"
                    />
                  </td>
                  <td className="p-1 font-bold">
                    Number of Cost of Money rates
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pool Information Section */}
          <div>
            <h2 className="italic font-bold text-purple-900 text-sm mb-1">
              Pool Information:
            </h2>

            <div className="grid grid-cols-12 gap-0 border border-black bg-white max-w-2xl">
              {/* Header Row */}
              <div className="col-span-3 bg-[#a6a6a6] border-r border-b border-black p-1 font-bold text-center flex items-center justify-center">
                Category Used?
              </div>
              <div className="col-span-6 bg-[#a6a6a6] border-r border-b border-black p-1 font-bold text-center">
                Pool Name{" "}
                <span className="font-normal">
                  (if category is used provide a descriptive name for this
                  category (i.e. Engineering Pool))
                </span>
              </div>
              <div className="col-span-3 bg-[#a6a6a6] border-b border-black p-1 font-bold text-center flex items-center justify-center">
                Short Name{" "}
                <span className="font-normal">(up to 10 characters)</span>
              </div>

              {/* Primary Indirect Pools Banner */}
              <div className="col-span-12 bg-blue-700 text-white font-bold p-1 border-b border-black flex items-center justify-between">
                <span>Primary Indirect Pools:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleAddPrimaryIndirectPool}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleClearPrimaryIndirectPools}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {setupData?.pools
                ?.filter((pool) => pool.isNewPrimaryIndirect)
                .map((pool) => (
                  <React.Fragment key={pool.tempId}>
                    <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                      <select
                        value={pool.isUsed ? "Yes" : "No"}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            isUsed: e.target.value === "Yes",
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent text-center font-bold italic outline-none"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-span-6 border-r border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.poolName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            poolName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="col-span-3 border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.shortName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            shortName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </React.Fragment>
                ))}

              {/* Row: G&A */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[0]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[0] = {
                      ...pools[0],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[0]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[0] = {
                      ...pools[0],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[0]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[0] = {
                      ...pools[0],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Row: OH - Onsite */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[1]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[1] = {
                      ...pools[1],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[1]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[1] = {
                      ...pools[1],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[1]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[1] = {
                      ...pools[1],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Row: OH - Offsite */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[2]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[2] = {
                      ...pools[2],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                {" "}
                <input
                  type="text"
                  value={setupData?.pools?.[2]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[2] = {
                      ...pools[2],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[2]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[2] = {
                      ...pools[2],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Row: SM&H */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[3]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[3] = {
                      ...pools[3],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[3]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[3] = {
                      ...pools[3],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[3]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[3] = {
                      ...pools[3],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Sub-row: Base Includes Options */}
              <div className="col-span-3 bg-white border-r border-b border-black p-1 font-bold text-right">
                Base Includes:
              </div>
              <div className="col-span-9 bg-[#e6ffff] border-b border-black p-1 flex items-center space-x-6">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="baseIncludes"
                    checked={setupData?.baseIncludes === "MATERIAL"}
                    onChange={() =>
                      setSetupData((current) => ({
                        ...current,
                        baseIncludes: "MATERIAL",
                      }))
                    }
                    className="accent-blue-600"
                  />
                  <span>only Material</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="baseIncludes"
                    checked={setupData?.baseIncludes === "SUBCONTRACT"}
                    onChange={() =>
                      setSetupData((current) => ({
                        ...current,
                        baseIncludes: "SUBCONTRACT",
                      }))
                    }
                    className="accent-blue-600"
                  />
                  <span>only Subcontracts</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="baseIncludes"
                    checked={setupData?.baseIncludes === "BOTH"}
                    onChange={() =>
                      setSetupData((current) => ({
                        ...current,
                        baseIncludes: "BOTH",
                      }))
                    }
                    className="accent-blue-600"
                  />
                  <span>both Material &amp; Subcontracts</span>
                </label>
              </div>

              {/* Fringe Banner */}
              <div className="col-span-12 bg-blue-700 text-white font-bold p-1 border-b border-black flex items-center justify-between">
                <span>Fringe:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleAddFringePool}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFringePools}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {setupData?.pools
                ?.filter((pool) => pool.isNewFringe)
                .map((pool) => (
                  <React.Fragment key={pool.tempId}>
                    <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                      <select
                        value={pool.isUsed ? "Yes" : "No"}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            isUsed: e.target.value === "Yes",
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent text-center font-bold italic outline-none"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-span-6 border-r border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.poolName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            poolName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="col-span-3 border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.shortName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            shortName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </React.Fragment>
                ))}

              {/* Row: Fringe Pool */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[4]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[4] = {
                      ...pools[4],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[4]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[4] = {
                      ...pools[4],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[4]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[4] = {
                      ...pools[4],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Sub-row: Fringe Options */}
              <div className="col-span-3 bg-[#808080] border-r border-b border-black p-1"></div>
              <div className="col-span-9 bg-[#e6ffff] border-b border-black p-2 space-y-1">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="fringeAlloc"
                    checked={setupData?.fringeIsIntermediateAllocation === true}
                    onChange={() =>
                      setSetupData((current) => ({
                        ...current,
                        fringeIsIntermediateAllocation: true,
                        fringeAppliedAsFinalRate: false,
                      }))
                    }
                    className="accent-blue-600"
                  />
                  <span>Fringe is only an intermediate allocation</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="fringeAlloc"
                    checked={setupData?.fringeAppliedAsFinalRate === true}
                    onChange={() =>
                      setSetupData((current) => ({
                        ...current,
                        fringeIsIntermediateAllocation: false,
                        fringeAppliedAsFinalRate: true,
                      }))
                    }
                    className="accent-blue-600"
                  />
                  <span>Fringe is applied as a final rate</span>
                </label>
                <div className="pt-1">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        setupData?.includeDirectLaborFringeInOverheadBase ??
                        false
                      }
                      onChange={(e) =>
                        setSetupData((current) => ({
                          ...current,
                          includeDirectLaborFringeInOverheadBase:
                            e.target.checked,
                        }))
                      }
                      className="w-3.5 h-3.5 accent-blue-600"
                    />
                    <span>
                      Include direct labor fringe in the overhead base?
                    </span>
                  </label>
                </div>
              </div>

              {/* Intermediate Pools Banner */}
              <div className="col-span-12 bg-blue-700 text-white font-bold p-1 border-b border-black flex items-center justify-between">
                <span>Intermediate Pools (Pro-rates):</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleAddIntermediatePool}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleClearIntermediatePools}
                    className="bg-white text-blue-700 border border-black px-2 py-0.5 font-bold text-[11px] hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {setupData?.pools
                ?.filter((pool) => pool.isNewIntermediate)
                .map((pool) => (
                  <React.Fragment key={pool.tempId}>
                    <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                      <select
                        value={pool.isUsed ? "Yes" : "No"}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            isUsed: e.target.value === "Yes",
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent text-center font-bold italic outline-none"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-span-6 border-r border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.poolName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            poolName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="col-span-3 border-b border-black p-1">
                      <input
                        type="text"
                        value={pool.shortName ?? ""}
                        onChange={(e) => {
                          const pools = [...(setupData?.pools ?? [])];
                          const poolIndex = pools.findIndex(
                            (p) => p.tempId === pool.tempId,
                          );

                          pools[poolIndex] = {
                            ...pools[poolIndex],
                            shortName: e.target.value,
                          };

                          setSetupData((current) => ({
                            ...current,
                            pools,
                          }));
                        }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </React.Fragment>
                ))}

              {/* Row: AERO Fringe */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[5]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[5] = {
                      ...pools[5],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[5]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[5] = {
                      ...pools[5],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[5]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[5] = {
                      ...pools[5],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Row: California Intermediate */}
              <div className="col-span-3 bg-[#ffffcc] border-r border-b border-black p-1 text-center font-bold italic">
                <select
                  value={setupData?.pools?.[6]?.isUsed ? "Yes" : "No"}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[6] = {
                      ...pools[6],
                      isUsed: e.target.value === "Yes",
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent text-center font-bold italic outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-6 border-r border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[6]?.poolName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[6] = {
                      ...pools[6],
                      poolName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="col-span-3 border-b border-black p-1">
                <input
                  type="text"
                  value={setupData?.pools?.[6]?.shortName ?? ""}
                  onChange={(e) => {
                    const pools = [...(setupData?.pools ?? [])];

                    pools[6] = {
                      ...pools[6],
                      shortName: e.target.value,
                    };

                    setSetupData((current) => ({
                      ...current,
                      pools,
                    }));
                  }}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Run Setup Warning Card */}
          <div className="pt-4 max-w-md">
            <div className="bg-[#800000] text-yellow-300 p-3 border border-black font-bold text-[11px]">
              <p>
                This Setup information will be used to customize the ICE model
                to reflect your organization.{" "}
                <span className="underline italic">
                  After completing all General and Pool Information
                </span>
                , click this button to complete the customization:
              </p>
              <div className="mt-3 text-right">
                <button
                  onClick={handleRunSetup}
                  className="bg-gray-200 text-blue-900 border border-black px-3 py-1 text-xs hover:bg-gray-300 font-bold shadow-sm"
                >
                  Run Setup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Schedule Navigation Links */}
        <div className="w-full md:w-1/4 space-y-4 pt-2">
          <div>
            <a
              href="#ice-manual"
              className="text-blue-900 underline font-bold text-sm hover:text-blue-950"
            >
              ICE Manual
            </a>
          </div>

          {/* Top Run Setup Warning Card */}
          <div className="bg-[#800000] text-yellow-300 p-3 border border-black font-bold text-[11px]">
            <p>
              This Setup information will be used to customize the ICE model to
              reflect your organization.{" "}
              <span className="underline italic">
                After completing all General and Pool Information
              </span>
              , click this button to complete the customization:
            </p>
            <div className="mt-3 text-right">
              <button className="bg-gray-200 text-blue-900 border border-black px-3 py-1 text-xs hover:bg-gray-300 font-bold shadow-sm">
                Run Setup
              </button>
            </div>
          </div>

          <div>
            <a
              href="#cost-of-money-note"
              className="text-blue-900 underline font-bold text-[11px] hover:text-blue-950 leading-tight block"
            >
              Please see Note in ICE Manual under Cost of Money - Sched F
            </a>
          </div>

          {/* Schedule Navigation Links Column */}
          <div className="space-y-2 pt-6 font-bold text-blue-900 text-[11px]">
            <div>
              <button
                onClick={() => onNavigate?.("sched_b")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched B
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate?.("sched_c1")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched C (1)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate?.("sched_c2")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched C (2)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate?.("sched_c6")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched C (6)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate?.("sched_fringe")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Fringe Worksheet
              </button>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigate?.("sched_d1")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched D (1)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate?.("sched_d2")}
                className="hover:underline text-left"
              >
                Enter detailed Pool costs on Sched D (2)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IceSetup;
