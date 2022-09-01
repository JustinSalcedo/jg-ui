import Button from "./Button"

export default function Navigation({
    navigateStages, position, lockedStage, firstButton, lastButton, leftButton, rightButton
}: {
    navigateStages: (way: 1 | -1) => void
    position?: 'first' | 'mid' | 'last'
    lockedStage? : boolean
    firstButton?: React.ReactNode
    lastButton?: React.ReactNode
    leftButton?: string
    rightButton?: string 
}) {
    return (
        <>
            <div className="navigation">
                {position === 'first' && firstButton ? firstButton : ''}
                { (!position || position === 'mid' || position === 'last') ? (
                    <Button type='secondary' clickHandler={() => navigateStages(-1)}>{leftButton || 'Back'}</Button>
                ) : '' }
                { (!position || position === 'first' || position === 'mid') ? (
                    <Button type={lockedStage ? 'disabled' : 'primary'} clickHandler={() => !lockedStage && navigateStages(1)}>{rightButton || 'Next'}</Button>
                ): '' }
                {position === 'last' && lastButton ? lastButton : ''}
            </div>
            {/* @ts-ignore */}
            <style jsx>{`
                .navigation {
                    grid-area: navigation;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                }
            `}</style>
        </>
    )
}