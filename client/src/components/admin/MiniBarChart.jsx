import { motion } from 'framer-motion';

export default function MiniBarChart({ data, valueKey = 'value', labelKey = 'label' }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d, i) => (
        <div key={d[labelKey]} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end overflow-hidden rounded-md bg-ink-50">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d[valueKey] / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-md bg-gradient-to-t from-primary-600 to-primary-400"
            />
          </div>
          <span className="text-[10px] font-medium text-ink-400">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
