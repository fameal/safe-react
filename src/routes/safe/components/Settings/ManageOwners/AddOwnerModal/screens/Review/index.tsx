import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ExplorerButton } from '@gnosis.pm/safe-react-components'

import { getExplorerInfo } from 'src/config'
import CopyBtn from 'src/components/CopyBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { safeNameSelector, safeOwnersSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'

import { OwnerValues } from '../..'
import { styles } from './style'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

export const ADD_OWNER_SUBMIT_BTN_TEST_ID = 'add-owner-submit-btn'

const useStyles = makeStyles(styles)

type ReviewAddOwnerProps = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters) => void
  values: OwnerValues
}

export const ReviewAddOwner = ({ onClickBack, onClose, onSubmit, values }: ReviewAddOwnerProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const safeName = useSelector(safeNameSelector)
  const owners = useSelector(safeOwnersSelector)
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()

  const {
    gasLimit,
    gasEstimation,
    gasCostFormatted,
    gasPriceFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
  } = useEstimateTransactionGas({
    txData: data,
    txRecipient: safeAddress,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
  })

  useEffect(() => {
    let isCurrent = true

    const calculateAddOwnerData = async () => {
      try {
        const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
        const txData = safeInstance.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        console.error('Error calculating ERC721 transfer data:', error.message)
      }
    }
    calculateAddOwnerData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, values.ownerAddress, values.threshold])

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = Number(gasPriceFormatted)
    const newGasPrice = Number(txParameters.ethGasPrice)
    const oldSafeTxGas = Number(gasEstimation)
    const newSafeTxGas = Number(txParameters.safeTxGas)

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <Row align="center" className={classes.heading} grow>
            <Paragraph className={classes.manage} noMargin weight="bolder">
              Add new owner
            </Paragraph>
            <Paragraph className={classes.annotation}>3 of 3</Paragraph>
            <IconButton disableRipple onClick={onClose}>
              <Close className={classes.closeIcon} />
            </IconButton>
          </Row>
          <Hairline />
          <Block>
            <Row className={classes.root}>
              <Col layout="column" xs={4}>
                <Block className={classes.details}>
                  <Block margin="lg">
                    <Paragraph color="primary" noMargin size="lg">
                      Details
                    </Paragraph>
                  </Block>
                  <Block margin="lg">
                    <Paragraph color="disabled" noMargin size="sm">
                      Safe name
                    </Paragraph>
                    <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                      {safeName}
                    </Paragraph>
                  </Block>
                  <Block margin="lg">
                    <Paragraph color="disabled" noMargin size="sm">
                      Any transaction requires the confirmation of:
                    </Paragraph>
                    <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                      {`${values.threshold} out of ${(owners?.size || 0) + 1} owner(s)`}
                    </Paragraph>
                  </Block>
                </Block>
              </Col>
              <Col className={classes.owners} layout="column" xs={8}>
                <Row className={classes.ownersTitle}>
                  <Paragraph color="primary" noMargin size="lg">
                    {`${(owners?.size || 0) + 1} Safe owner(s)`}
                  </Paragraph>
                </Row>
                <Hairline />
                {owners?.map((owner) => (
                  <React.Fragment key={owner.address}>
                    <Row className={classes.owner}>
                      <Col align="center" xs={1}>
                        <Identicon address={owner.address} diameter={32} />
                      </Col>
                      <Col xs={11}>
                        <Block className={classNames(classes.name, classes.userName)}>
                          <Paragraph noMargin size="lg" weight="bolder">
                            {owner.name}
                          </Paragraph>
                          <Block className={classes.user} justify="center">
                            <Paragraph className={classes.address} color="disabled" noMargin size="md">
                              {owner.address}
                            </Paragraph>
                            <CopyBtn content={owner.address} />
                            <ExplorerButton explorerUrl={getExplorerInfo(owner.address)} />
                          </Block>
                        </Block>
                      </Col>
                    </Row>
                    <Hairline />
                  </React.Fragment>
                ))}
                <Row align="center" className={classes.info}>
                  <Paragraph color="primary" noMargin size="md" weight="bolder">
                    ADDING NEW OWNER &darr;
                  </Paragraph>
                </Row>
                <Hairline />
                <Row className={classes.selectedOwner}>
                  <Col align="center" xs={1}>
                    <Identicon address={values.ownerAddress} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size="lg" weight="bolder">
                        {values.ownerName}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph className={classes.address} color="disabled" noMargin size="md">
                          {values.ownerAddress}
                        </Paragraph>
                        <CopyBtn content={values.ownerAddress} />
                        <ExplorerButton explorerUrl={getExplorerInfo(values.ownerAddress)} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </Col>
            </Row>
          </Block>
          <Hairline />

          {/* Tx Parameters */}
          <TxParametersDetail
            txParameters={txParameters}
            onEdit={toggleEditMode}
            compact={false}
            isTransactionCreation={isCreation}
            isTransactionExecution={isExecution}
            isOffChainSignature={isOffChainSignature}
          />

          <Block className={classes.gasCostsContainer}>
            <TransactionFees
              gasCostFormatted={gasCostFormatted}
              isExecution={isExecution}
              isCreation={isCreation}
              isOffChainSignature={isOffChainSignature}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          </Block>
          <Hairline />
          <Row align="center" className={classes.buttonRow}>
            <Button minHeight={42} minWidth={140} onClick={onClickBack}>
              Back
            </Button>
            <Button
              color="primary"
              minHeight={42}
              minWidth={140}
              onClick={() => onSubmit(txParameters)}
              testId={ADD_OWNER_SUBMIT_BTN_TEST_ID}
              disabled={txEstimationExecutionStatus === EstimationStatus.LOADING}
              variant="contained"
            >
              Submit
            </Button>
          </Row>
        </>
      )}
    </EditableTxParameters>
  )
}
