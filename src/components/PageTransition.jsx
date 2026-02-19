import { motion, AnimatePresence } from 'framer-motion';

// ========================================
// Page Transition Wrapper
// ========================================
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    out: {
        opacity: 0,
        y: -15,
        scale: 0.98,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
};

const PageTransition = ({ children, keyProp }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyProp}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
