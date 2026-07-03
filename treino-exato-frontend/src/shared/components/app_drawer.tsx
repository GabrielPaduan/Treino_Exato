import {
    Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Switch, Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const AppDrawer = ({ open, onClose, darkMode, onToggleDarkMode }: AppDrawerProps) => {
    return (
        <Drawer anchor="left" variant="temporary" open={open} onClose={onClose}>
            <Box sx={{ width: 280 }} role="presentation">
                <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{ py: 2, letterSpacing: 1, fontWeight: 700 }}
                >
                    MENU
                </Typography>
                <Divider />
                <List disablePadding>
                    <ListItemButton onClick={onToggleDarkMode}>
                        <ListItemText primary="MODO ESCURO" />
                        <Switch
                            edge="end"
                            checked={darkMode}
                            onChange={onToggleDarkMode}
                            onClick={(e) => e.stopPropagation()}
                            inputProps={{ 'aria-label': 'Alternar modo escuro' }}
                        />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton
                        onClick={() => {
                            // TODO: navegar pra tela de configuracoes quando ela existir.
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="CONFIGURAÇÕES" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={onClose}>
                        <ListItemIcon>
                            <ArrowBackIcon />
                        </ListItemIcon>
                        <ListItemText primary="FECHAR MENU" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};
